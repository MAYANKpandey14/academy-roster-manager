import React, { useState, useEffect } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Global cache for signed URLs to minimize API requests
const signedUrlCache: Record<string, { url: string; expiresAt: number }> = {};

/**
 * Parses a Supabase storage URL to extract the bucket and relative path.
 */
export function parseStorageUrl(url: string) {
  if (!url) return null;
  if (url.includes('/storage/v1/object/')) {
    try {
      const parts = url.split('/storage/v1/object/')[1].split('/');
      if (parts.length >= 3) {
        const bucket = parts[1];
        const path = parts.slice(2).join('/');
        return { bucket, path };
      }
    } catch (e) {
      console.error("Failed to parse storage URL:", url, e);
    }
  }
  return null;
}

/**
 * Resolves a storage URL to a secure signed URL, with caching support.
 */
export async function getSecureUrl(url: string): Promise<string> {
  const parsed = parseStorageUrl(url);
  if (!parsed) {
    return url; // Return as-is if not a storage URL (e.g. local preview blob or external link)
  }

  const cacheKey = `${parsed.bucket}:${parsed.path}`;
  const now = Date.now();
  const cached = signedUrlCache[cacheKey];

  // If cached and has at least 5 minutes of validity left, use it
  if (cached && cached.expiresAt > now + 300 * 1000) {
    return cached.url;
  }

  try {
    const { data, error } = await supabase.storage
      .from(parsed.bucket)
      .createSignedUrl(parsed.path, 3600); // 1 hour

    if (error) {
      console.error("Failed to generate signed URL:", error);
      return url; // fallback to original
    }

    if (data?.signedUrl) {
      signedUrlCache[cacheKey] = {
        url: data.signedUrl,
        expiresAt: now + 3600 * 1000,
      };
      return data.signedUrl;
    }
  } catch (err) {
    console.error("Error creating signed URL:", err);
  }

  return url;
}

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

/**
 * A secure image component that retrieves signed URLs for private Supabase storage.
 */
export const SecureImage = ({ src, alt, className, fallback, ...props }: SecureImageProps) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setResolvedSrc(undefined);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    getSecureUrl(src)
      .then((url) => {
        if (isMounted) {
          setResolvedSrc(url);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error in SecureImage:", err);
        if (isMounted) {
          setResolvedSrc(src); // fallback
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  if ((isLoading || hasError || !resolvedSrc) && fallback) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

/**
 * A secure avatar image component that resolves signed URLs for private Supabase storage.
 * Directly replaces Radix / Shadcn AvatarImage.
 */
export const SecureAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ src, className, ...props }, ref) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!src) {
      setResolvedSrc(undefined);
      return;
    }

    let isMounted = true;
    getSecureUrl(src).then((url) => {
      if (isMounted) {
        setResolvedSrc(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <AvatarPrimitive.Image
      ref={ref}
      src={resolvedSrc}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
});
SecureAvatarImage.displayName = "SecureAvatarImage";

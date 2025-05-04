
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageUploadProps {
  bucketName: string;
  entityId?: string;
  initialImageUrl?: string;
  onImageUpload: (url: string) => void;
  label?: string;
}

export const ImageUpload = ({ 
  bucketName, 
  entityId, 
  initialImageUrl, 
  onImageUpload,
  label
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  const [error, setError] = useState<string | null>(null);
  const { isHindi } = useLanguage();
  
  // Set the initial image URL when the component mounts or when initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setError(isHindi ? 
        "केवल JPG, PNG और WEBP छवियां स्वीकार की जाती हैं" : 
        "Only JPG, PNG, and WEBP images are accepted");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(isHindi ? 
        "छवि 5MB से छोटी होनी चाहिए" : 
        "Image must be smaller than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);
    
    try {
      // Get the current session to include auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.warn("No active session found for image upload");
        setError(isHindi ? 
          "लॉगिन सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।" : 
          "Login session expired. Please log in again.");
        setIsUploading(false);
        return;
      }
      
      // Check if bucket exists first instead of trying to create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      // Only try to create the bucket if it doesn't exist
      if (!bucketExists) {
        try {
          console.log(`Creating bucket: ${bucketName}`);
          await supabase.storage.createBucket(bucketName, {
            public: true
          });
        } catch (bucketError) {
          console.log("Bucket may already exist or couldn't be created, attempting upload anyway:", bucketError);
          // Continue with upload even if bucket creation fails - it might already exist
        }
      }
      
      // Use entityId if provided, otherwise generate a random name
      const fileName = entityId 
        ? `${entityId}.${file.name.split('.').pop()}`
        : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;
      
      // Upload the file
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      const url = publicUrlData.publicUrl;
      console.log("Image uploaded successfully:", url);
      setImageUrl(url);
      onImageUpload(url);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(isHindi ? 
        "छवि अपलोड करने में त्रुटि हुई है" : 
        "Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormItem>
      <FormLabel className={isHindi ? 'font-hindi' : ''}>
        {label || (isHindi ? 'प्रोफाइल फोटो' : 'Profile Photo')}
      </FormLabel>
      <FormControl>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="relative overflow-hidden" 
              disabled={isUploading}
            >
              <span className={`${isHindi ? 'font-hindi' : ''}`}>
                {isUploading 
                  ? (isHindi ? "अपलोड हो रहा है..." : "Uploading...") 
                  : (isHindi ? "फोटो चुनें" : "Choose Photo")}
              </span>
              <Upload className="ml-2 h-4 w-4" />
              <Input 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/webp" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange} 
              />
            </Button>
            {imageUrl && (
              <span className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "फोटो अपलोड किया गया" : "Photo uploaded"}
              </span>
            )}
          </div>
          
          {imageUrl && (
            <div className="relative w-24 h-24 rounded-md overflow-hidden border">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          
          {error && <FormMessage>{error}</FormMessage>}
        </div>
      </FormControl>
    </FormItem>
  );
};

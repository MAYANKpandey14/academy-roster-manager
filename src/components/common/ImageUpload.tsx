
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
  onImageUpload: (url: string | null) => void;
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
    
    // Determine photo type and limits
    const photoType = bucketName.includes('trainee') ? 'trainee' : 'staff';
    const maxSizeKB = photoType === 'trainee' ? 350 : 500;
    const maxCount = photoType === 'trainee' ? 2000 : 500;
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setError(isHindi ? 
        "केवल JPG, PNG और WEBP छवियां स्वीकार की जाती हैं" : 
        "Only JPG, PNG, and WEBP images are accepted");
      return;
    }

    // Check file size in KB
    const fileSizeKB = Math.round(file.size / 1024);
    if (fileSizeKB > maxSizeKB) {
      setError(isHindi ? 
        `छवि बहुत बड़ी है। अधिकतम आकार: ${maxSizeKB} KB। वर्तमान आकार: ${fileSizeKB} KB।` :
        `Image too large. Max size: ${maxSizeKB} KB. Current size: ${fileSizeKB} KB.`);
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
      
      // Create form data for the edge function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', bucketName);
      if (entityId) {
        formData.append('entityId', entityId);
      }

      // Call the image processing edge function
      const { data: uploadResponse, error: uploadError } = await supabase.functions.invoke('process-image-upload', {
        body: formData
      });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      if (uploadResponse.error) {
        // Handle specific error codes
        if (uploadResponse.errorCode === 'MAX_COUNT_EXCEEDED') {
          setError(isHindi ? 
            `अधिकतम ${photoType === 'trainee' ? 'प्रशिक्षु' : 'स्टाफ'} फोटो सीमा पहुंच गई (${maxCount})। अधिक अपलोड करने के लिए मौजूदा फोटो हटाएं।` :
            uploadResponse.error);
        } else if (uploadResponse.errorCode === 'IMAGE_TOO_LARGE') {
          setError(isHindi ? 
            `छवि बहुत बड़ी है। अधिकतम आकार: ${maxSizeKB} KB।` :
            uploadResponse.error);
        } else {
          setError(uploadResponse.error);
        }
        return;
      }
      
      const url = uploadResponse.url;
      const wasReplaced = uploadResponse.replaced;
      
      console.log(wasReplaced ? "Image replaced successfully:" : "Image uploaded successfully:", url);
      setImageUrl(url);
      onImageUpload(url);
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(isHindi ? 
        "छवि अपलोड करने में त्रुटि हुई है" : 
        `Error uploading image: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormItem>
      <FormLabel className={isHindi ? 'font-hindi' : ''}>
        {label || (isHindi ? 'प्रोफाइल फोटो (वैकल्पिक)' : 'Profile Photo (Optional)')}
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
                {entityId 
                  ? (isHindi ? "फोटो अपडेट किया गया" : "Photo updated") 
                  : (isHindi ? "फोटो अपलोड किया गया" : "Photo uploaded")}
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

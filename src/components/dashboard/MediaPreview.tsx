interface MediaPreviewProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  alt: string;
}

export const MediaPreview = ({ mediaUrl, mediaType, alt }: MediaPreviewProps) => {
  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border shadow-card">
      {mediaType === 'image' ? (
        <img 
          src={mediaUrl} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <video 
          src={mediaUrl}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />
      )}
    </div>
  );
};
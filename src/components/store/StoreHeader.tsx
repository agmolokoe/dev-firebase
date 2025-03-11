
import { Instagram, Facebook, Twitter } from "lucide-react";

type StoreHeaderProps = {
  businessProfile: {
    business_name: string;
    logo_url?: string;
    business_description?: string;
    social_media?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    business_address?: string;
    contact_email?: string;
    contact_phone?: string;
  };
};

export function StoreHeader({ businessProfile }: StoreHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            {businessProfile.logo_url ? (
              <img 
                src={businessProfile.logo_url} 
                alt={businessProfile.business_name} 
                className="w-24 h-24 rounded-full mb-4 mx-auto md:mx-0 object-cover border-2 border-primary" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full mb-4 mx-auto md:mx-0 bg-primary/20 flex items-center justify-center border-2 border-primary">
                <span className="text-2xl font-bold">
                  {businessProfile.business_name?.charAt(0) || "S"}
                </span>
              </div>
            )}
            <h1 className="text-4xl font-bold mb-2">{businessProfile.business_name}</h1>
            <p className="text-muted-foreground max-w-xl">
              {businessProfile.business_description || "Welcome to our online store."}
            </p>
          </div>
          
          <div className="flex space-x-4">
            {businessProfile.social_media?.instagram && (
              <a 
                href={businessProfile.social_media.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Instagram size={20} />
              </a>
            )}
            {businessProfile.social_media?.facebook && (
              <a 
                href={businessProfile.social_media.facebook} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Facebook size={20} />
              </a>
            )}
            {businessProfile.social_media?.twitter && (
              <a 
                href={businessProfile.social_media.twitter} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Twitter size={20} />
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
          {businessProfile.business_address && (
            <div>{businessProfile.business_address}</div>
          )}
          {businessProfile.contact_email && (
            <div>
              <a href={`mailto:${businessProfile.contact_email}`} className="hover:text-primary">
                {businessProfile.contact_email}
              </a>
            </div>
          )}
          {businessProfile.contact_phone && (
            <div>
              <a href={`tel:${businessProfile.contact_phone}`} className="hover:text-primary">
                {businessProfile.contact_phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

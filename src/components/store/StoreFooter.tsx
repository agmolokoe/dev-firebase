
type StoreFooterProps = {
  businessName: string;
  websiteUrl?: string;
};

export function StoreFooter({ businessName, websiteUrl }: StoreFooterProps) {
  return (
    <footer className="mt-auto py-8 border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        {websiteUrl && (
          <a 
            href={websiteUrl} 
            target="_blank" 
            rel="noreferrer"
            className="inline-block mt-2 hover:text-primary transition-colors"
          >
            Visit our website
          </a>
        )}
      </div>
    </footer>
  );
}

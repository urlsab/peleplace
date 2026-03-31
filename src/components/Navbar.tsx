import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import RegistrationDialog from "@/components/RegistrationDialog";

const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" fill="hsl(var(--primary-foreground))" />
          </div>
          <span className="text-xl font-black font-display">פל״א</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#categories" className="hover:text-foreground transition-colors">קטגוריות</a>
          <a href="#opportunities" className="hover:text-foreground transition-colors">הזדמנויות</a>
          <a href="#about" className="hover:text-foreground transition-colors">עלינו</a>
        </div>
        <RegistrationDialog
          trigger={
            <Button size="sm" className="rounded-full font-semibold">
              הרשמה
            </Button>
          }
        />
      </div>
    </nav>
  );
};

export default Navbar;

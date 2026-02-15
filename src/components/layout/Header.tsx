import { useState } from 'react';
import { Moon, Sun, ChevronDown, User, Settings, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [workspace] = useState('Brandstori');
  const [project] = useState('Knowledge Base');

  return (
    <header className="h-14 border-b glass flex items-center justify-between px-4 z-50 relative">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            <span className="gradient-text">Brandstori</span>
            <span className="text-muted-foreground font-normal ml-1">AI</span>
          </span>
        </div>

        {/* Workspace / Project selector */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                {workspace} <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Brandstori</DropdownMenuItem>
              <DropdownMenuItem>Acme Corp</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-muted-foreground/40">/</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                {project} <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Knowledge Base</DropdownMenuItem>
              <DropdownMenuItem>Marketing Docs</DropdownMenuItem>
              <DropdownMenuItem>Engineering Wiki</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 rounded-full pl-2 pr-3">
              <div className="h-7 w-7 rounded-full gradient-bg flex items-center justify-center text-xs font-medium text-primary-foreground">
                SC
              </div>
              <span className="hidden sm:inline text-sm">Sarah Chen</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

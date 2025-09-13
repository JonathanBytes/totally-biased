import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background/50 border-t backdrop-blur-sm mt-4">
      <div className="max-w-3xl container mx-auto flex items-center justify-between p-4 text-sm text-muted-foreground">
        <p>
          Built by{" "}
          <Link
            href="https://jonathanbytes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            JonathanBytes
          </Link>
          .
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/JonathanBytes/totally-biased"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            <Image
              src="/github.svg"
              alt="GitHub"
              width={16}
              height={16}
              className="dark:invert"
            />
            Source Code
          </Link>
        </div>
      </div>
    </footer>
  );
}

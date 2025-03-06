import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { CircleArrowUp, CircleArrowDown } from "lucide-react";

interface OnThisPageProps {
  sections: { id: string; title: string }[];
}

export function OnThisPage({ sections }: OnThisPageProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check for active section
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        if (
          scrollPosition >= elementTop - 100 &&
          scrollPosition < elementTop + elementHeight
        ) {
          setActiveSection(section.id);
          break;
        }
      }

      // Check if near bottom or top of page
      // Consider "near bottom" as within 200px of the bottom
      setIsNearBottom(scrollPosition + windowHeight >= documentHeight - 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky top-24 self-start hidden md:block w-64 pl-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
          On This Page
        </h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                to={`#${section.id}`}
                className={`
                  block text-sm transition-colors duration-200
                  ${
                    activeSection === section.id
                      ? "text-primary font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Separator className="my-4" />
      <div className="flex space-x-2">
        {isNearBottom ? (
          <button
            onClick={scrollToTop}
            className="text-gray-500 hover:text-gray-900 transition-colors inline-flex gap-1 items-center text-sm"
            title="Scroll to Top"
          >
            Scroll to Top <CircleArrowUp size={16} />
          </button>
        ) : (
          <button
            onClick={scrollToBottom}
            className="text-gray-500 hover:text-gray-900 transition-colors inline-flex gap-1 items-center text-sm"
            title="Scroll to Bottom"
          >
            Scroll to End <CircleArrowDown size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

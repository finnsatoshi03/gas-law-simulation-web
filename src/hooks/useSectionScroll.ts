import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useSectionScroll() {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL
    const { hash } = location;

    // Define scroll padding (adjust value as needed)
    const SCROLL_PADDING_TOP = 100; // in pixels

    if (hash) {
      // Remove the '#' from the hash
      const id = hash.replace("#", "");

      // Find the element with the corresponding id
      const element = document.getElementById(id);

      if (element) {
        // Calculate scroll position with top padding
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - SCROLL_PADDING_TOP;

        // Scroll to the element with smooth behavior and top padding
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      // If no hash, scroll to top of the page
      window.scrollTo(0, 0);
    }
  }, [location.hash]);
}

import type {ReactNode} from "react";
import React, {useEffect, useRef, useState} from "react";

interface AutoScrollProps {
  children: ReactNode;
}

export const AutoScroll: React.FC<AutoScrollProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const totalItems = React.Children.count(children);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalItems);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalItems]);

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth * index;
      containerRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [index]);

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", overflowX: "hidden", aspectRatio: "16/9" }}
    >
      {children}
    </div>
  );
};

export const HtmlLoader: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("/page.html")
      .then((response) => response.text())
      .then((data) => setHtmlContent(data))
      .catch((error) => console.error("Error loading HTML:", error));
  }, []);

  return (
    <div
      className="html-wrapper"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

const Index: React.FC = () => {
  return <div>Index component here</div>;
};

export default Index;
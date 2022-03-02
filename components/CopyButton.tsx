import { useState, useEffect } from "react";

type CopyProps = {
  icon?: string;
  title?: string;
  className?: string;
  content: string;
};

export default function CopyButton({
  icon = "copy",
  title = "click to copy",
  content,
  className = "button small",
}: CopyProps) {
  const [copied, setCopied] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState<
    ReturnType<typeof setTimeout> | undefined
  >();

  useEffect(() => () => timeoutRef && clearTimeout(timeoutRef), [timeoutRef]);
  useEffect(() => setCopied(false), [content]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeoutRef(setTimeout(() => setCopied(false), 2000));
  };

  return (
    <button
      className={className}
      onClick={() => copyToClipboard(content)}
      title={copied ? "copied to clipboard" : title}
    >
      <i className={`fas fa-fw fa-${copied ? "check-circle" : icon}`} />
    </button>
  );
}

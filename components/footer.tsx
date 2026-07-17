export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>TeaBrew — find tea near you, brew it right at home.</p>
        <p>
          Places from{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-brew"
          >
            OpenStreetMap
          </a>
          . Your shelf stays on this device.
        </p>
      </div>
    </footer>
  );
}

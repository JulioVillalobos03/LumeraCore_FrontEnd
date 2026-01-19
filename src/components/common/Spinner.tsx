export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-80">
      <div
        className="
          h-8 w-8
          rounded-full
          border-2 border-(--color-primary)/30
          border-t-(--color-primary)
          animate-spin
        "
      />
    </div>
  );
}

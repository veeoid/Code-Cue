interface SummaryProps {
  response: string;
}

export default function Summary({ response }: SummaryProps) {
  return (
    <div
      style={{
        marginTop: "10px",
        background: "#f8f8f8",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
        <code>{response}</code>
      </pre>
    </div>
  );
}

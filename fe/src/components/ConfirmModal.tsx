interface Props {
  filename: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ filename, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p className="modal-message">
          Delete <strong>{filename}</strong>?
        </p>
        <p className="modal-sub">This cannot be undone.</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

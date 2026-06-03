import Modal from './Modal'

export default function DeleteModal({ open, onClose, onConfirm, subName }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Subscription" labelledBy="delete-title">
      <p className="text-zinc-300 mb-6">
        {subName
          ? `Delete "${subName}"? This can't be undone.`
          : "Are you sure you want to delete this subscription? This can't be undone."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 bg-danger hover:bg-red-500 text-white font-semibold rounded-xl transition-all active:scale-95"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

const IncomingCallToast = ({ userName, onAccept, onReject }) => {
  return (
    <div className="flex flex-col gap-2">
      <p>📞 {userName} is calling...</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            toast.dismiss();
            onAccept();
          }}
          className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => {
            toast.dismiss();
            onReject();
          }}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default React.memo(IncomingCallToast)
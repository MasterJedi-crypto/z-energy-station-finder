export function SavedTrips({ trips, onDelete }) {
  if (!trips.length) {
    return <p className="mt-8 text-z-muted">No saved trips yet.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-z-navy">My saved trips</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {trips.map((trip) => (
          <li
            key={trip._id}
            className="flex items-center justify-between rounded-lg bg-z-card px-4 py-3"
          >
            <span>
              {trip.from} → {trip.to}
            </span>
            <button
              type="button"
              onClick={() => onDelete(trip._id)}
              className="font-bold text-z-orange"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
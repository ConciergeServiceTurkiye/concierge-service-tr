export default function createReservation(data) {
  return {
    id: data.id,
    restaurant: data.restaurant,
    date: data.date,
    time: data.time,
    guests: data.guests,
    allergy: data.allergy || "Yok",
    note: data.note || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

interface Plan {
  uid: string;
  title: string;
  createTime: FirebaseFirestore.Timestamp;
  places: string[];
}

interface CreatePlanRequest {
  uid: string;
  title: string;
}

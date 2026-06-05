import { useParams } from "react-router-dom";

export default function SearchProfile() {
  const { userId } = useParams();

  return <div>User ID: {userId}</div>;
}
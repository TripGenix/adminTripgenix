import { useNavigate } from "react-router-dom";

export default function useNavigator() {
  const navigate = useNavigate();

  return (path) => {
    navigate(path);
  };
}
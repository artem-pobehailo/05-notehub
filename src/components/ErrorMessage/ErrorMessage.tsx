import css from "./ErrorMessage.module.css";

export default function ErrorMessage() {
  return <p className={css.text}>Error loading notes, please try again...</p>;
}

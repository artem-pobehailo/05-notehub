import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "../../services/noteService";

import css from "./NoteForm.module.css";
import type { NewNoteData, Note } from "../../types/note";

interface NoteFormProps {
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .required("Required"),
  content: Yup.string().max(500, "Max 500 characters"),
  tag: Yup.mixed<Note["tag"]>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: (newNoteData: NewNoteData) => addNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" as Note["tag"] }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        const newNoteData: NewNoteData = { ...values };

        createNoteMutation.mutate(newNoteData, {
          onSettled: () => {
            setSubmitting(false);
            resetForm();
          },
        });
      }}
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onSuccess}
              disabled={isSubmitting || createNoteMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={
                !isValid ||
                !dirty ||
                isSubmitting ||
                createNoteMutation.isPending
              }
            >
              {createNoteMutation.isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

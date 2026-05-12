import { getPlayerData } from "core-integration/src/store/player/reducers";
import { Button } from "plos/src/components/buttons/Button";
import { FormLabel, FormTextField } from "plos/src/components/Forms";
import { contentMain } from "plos/src/layouts";
import { useEffect, useState } from "react";
import { TextArea, TextField } from "react-aria-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { contactButtons, contactTextArea } from "./help.css";

// For report offensive name
interface Props {
  message?: string;
  subject?: string;
  canCancel?: boolean;
}

const ContactUs = ({
  message = "",
  subject = "",
  canCancel = false,
}: Props) => {
  const player = useSelector(getPlayerData);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subjectState, setSubjectState] = useState(subject);
  const [messageState, setMessageState] = useState(message);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (player) {
      setName(`${player.first_name} ${player.last_name}`);
      setEmail(player.email);
    }
  }, [player]);

  const handleSetName = (value: string) => {
    setName(value);
  };
  const handleSetEmail = (value: string) => {
    setEmail(value);
  };
  const handleSetSubject = (value: string) => {
    setSubjectState(value);
  };
  const handleSetMessage = (value: string) => {
    setMessageState(value);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  const goBack = () => {
    navigate(-1);
  };

  const areAllInputsFilled = name && email && subjectState && messageState;
  const disabled = !areAllInputsFilled || isSubmitting;

  const submitButton = (
    <Button type="submit" isDisabled={disabled}>
      {isSubmitting ? "Please wait..." : "Send Message"}
    </Button>
  );

  return (
    <>
      {!player && (
        <p>
          If you have an account please login before sending your message. If
          you are unable to login please provide as many details as possible to
          help us find your account.
        </p>
      )}
      <form
        action="https://ismfg.sirportly.com/remote_form/74"
        method="post"
        onSubmit={handleSubmit}
      >
        <div className={contentMain}>
          <FormTextField
            name="ticket[name]"
            id="ismSFName"
            label="Your name:"
            value={name}
            isReadOnly={!!player}
            onChange={handleSetName}
          />
          <FormTextField
            name="ticket[email]"
            type="email"
            id="ismSFEmail"
            label="Your email:"
            value={email}
            isReadOnly={!!player}
            onChange={handleSetEmail}
          />
          <FormTextField
            name="ticket[subject]"
            id="ismSFSubject"
            label="Subject:"
            value={subjectState}
            isReadOnly={!!subject}
            onChange={handleSetSubject}
          />
          <TextField
            name="ticket[message]"
            id="ismSFMessage"
            value={messageState}
            onChange={handleSetMessage}
          >
            <FormLabel label="Your message:" />
            <TextArea rows={10} className={contactTextArea} />
          </TextField>
          {canCancel ? (
            <div className={contactButtons}>
              {submitButton}
              <Button onPress={goBack}>Cancel</Button>
            </div>
          ) : (
            <>{submitButton}</>
          )}
        </div>
      </form>
    </>
  );
};

export default ContactUs;

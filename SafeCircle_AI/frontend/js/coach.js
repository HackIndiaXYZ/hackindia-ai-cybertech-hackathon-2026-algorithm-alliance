export function init() {
  const form = document.querySelector("#quiz-form");
  const answer = document.querySelector("#quiz-answer");
  const feedback = document.querySelector("#quiz-feedback");

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (answer.value === "verify") {
      feedback.textContent =
        "Correct. Pause, keep your OTP private, and verify through a trusted channel.";
    } else {
      feedback.textContent =
        "Try again. Pressure is a warning sign. Do not share your OTP or use the supplied link.";
    }
  });
}
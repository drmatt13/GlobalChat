function playSound(url: string) {
  const audio = new Audio(url);
  audio
    .play()
    .then(() => {
      // Sound is playing
    })
    .catch((error) => console.error("Error playing the sound:", error));

  // Optional: Cleanup after the sound has finished playing
  audio.addEventListener(
    "ended",
    () => {
      audio.remove(); // This removes the audio element after it has played
    },
    { once: true }
  ); // Ensures the event listener is removed after it fires once
}

export default playSound;

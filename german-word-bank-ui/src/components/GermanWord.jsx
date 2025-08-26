import React from 'react';

const GermanWord = ({ word, className }) => {
  // If no word is provided, render nothing.
  if (!word) return null;

  // Determine the correct CSS class for the artikel, if it exists.
  const artikelClass = word.artikel ? `artikel-${word.artikel}` : '';

  return (
    <span className={className}>
      {word.artikel && <span className={`me-2 ${artikelClass}`}>{word.artikel}</span>}
      {word.german_word}
    </span>
  );
};

export default GermanWord;
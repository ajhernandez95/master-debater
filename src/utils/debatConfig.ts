import { topics, personas } from "./../constants/defaults";

export const getRandomTopic = () => {
  const randomIdx = Math.floor(Math.random() * topics.length);
  return topics[randomIdx];
};

export const getRandomPersona = () => {
  const randomIdx = Math.floor(Math.random() * personas.length);
  return personas[randomIdx];
};

import { newsletterRepository } from "../repositories/newsletter.repository.js";

export const newsletterService = {
  subscribe(email) {
    return newsletterRepository.upsert(email);
  },
};

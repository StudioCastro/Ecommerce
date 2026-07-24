import { contactRepository } from "../repositories/contact.repository.js";

export const contactService = {
  create({ name, email, subject, message }) {
    return contactRepository.create({ name, email, subject, message });
  },
};

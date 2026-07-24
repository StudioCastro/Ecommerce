import { addressRepository } from "../repositories/address.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

export const addressService = {
  list(userId) {
    return addressRepository.findManyByUser(userId);
  },

  create(userId, data) {
    return addressRepository.create(userId, data);
  },

  // Usado pelo checkout (order.service) para garantir que o endereço informado
  // realmente pertence ao usuário autenticado.
  async getOwned(userId, addressId) {
    const address = await addressRepository.findById(addressId);
    if (!address || address.userId !== userId) {
      throw new AppError("Endereço não encontrado.", 404);
    }
    return address;
  },
};

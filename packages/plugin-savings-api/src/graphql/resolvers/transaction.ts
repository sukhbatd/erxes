import { IContext } from '../../connectionResolver';
import { sendMessageBroker } from '../../messageBroker';
import { ITransaction } from '../../models/definitions/transactions';

const Transactions = {
  async company(transaction: ITransaction, {}, { subdomain }: IContext) {
    return sendMessageBroker(
      {
        subdomain,
        action: 'companies.findOne',
        data: { _id: transaction.companyId },
        isRPC: true
      },
      'contacts'
    );
  },
  async customer(transaction: ITransaction, {}, { subdomain }: IContext) {
    return sendMessageBroker(
      {
        subdomain,
        action: 'companies.findOne',
        data: { _id: transaction.companyId },
        isRPC: true
      },
      'contacts'
    );
  },
  async contract(transaction: ITransaction, {}, { models }: IContext) {
    return models.Contracts.findOne({ _id: transaction.contractId });
  }
};

export default Transactions;

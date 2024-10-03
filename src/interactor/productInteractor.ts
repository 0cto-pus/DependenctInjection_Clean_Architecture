import { inject, injectable } from 'inversify';
import { IMailer } from '../interface/IMailer';
import { IMessageBroker } from '../interface/IMessageBroker';
import { IProductInteractor } from '../interface/IProductInteractor';
import { IProductRepository } from '../interface/IProductRepository';
import { INTERFACE_TYPE } from '../util';

@injectable()
export class ProductInteractor implements IProductInteractor {
  private repository: IProductRepository;
  private mailer: IMailer;
  private broker: IMessageBroker;

  constructor(
    @inject(INTERFACE_TYPE.ProductRepository) repository: IProductRepository,
    @inject(INTERFACE_TYPE.Mailer) mailer: IMailer,
    @inject(INTERFACE_TYPE.MessageBroker) broker: IMessageBroker
  ) {
    this.repository = repository;
    (this.mailer = mailer), (this.broker = broker);
  }

  async createProduct(input: any) {
    const data = await this.repository.create(input);

    await this.broker.NotifyToPromotionService(data);

    return data;
  }
  async updateStock(id: number, stock: number) {
    const data = await this.repository.update(id, stock);
    await this.mailer.SendEmail('test@test.com', data);
    return data;
  }
  async getProducts(limit: number, offset: number) {
    return this.repository.find(limit, offset);
  }
}

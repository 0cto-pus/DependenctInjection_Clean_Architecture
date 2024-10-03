import express from 'express';
import { Container } from 'inversify';
import { IProductRepository } from '../interface/IProductRepository';
import { INTERFACE_TYPE } from '../util';
import { ProductRepository } from '../repository/productRepository';
import { IProductInteractor } from '../interface/IProductInteractor';
import { ProductInteractor } from '../interactor/productInteractor';
import { IMailer } from '../interface/IMailer';
import { Mailer } from '../external-libraries/mailer';
import { IMessageBroker } from '../interface/IMessageBroker';
import { MessageBroker } from '../external-libraries/messageBroker';
import { ProductController } from '../controller/ProductController';

const container = new Container();

container
  .bind<IProductRepository>(INTERFACE_TYPE.ProductRepository)
  .to(ProductRepository);

container
  .bind<IProductInteractor>(INTERFACE_TYPE.ProductInteractor)
  .to(ProductInteractor);

container.bind<IMailer>(INTERFACE_TYPE.Mailer).to(Mailer);

container.bind<IMessageBroker>(INTERFACE_TYPE.MessageBroker).to(MessageBroker);

container.bind(INTERFACE_TYPE.ProductController).to(ProductController);

const router = express.Router();

const controller = container.get<ProductController>(
  INTERFACE_TYPE.ProductController
);

router.post('/products', controller.onCreateProduct.bind(controller));
router.get('/products', controller.onGetProducts.bind(controller));
router.patch('/products/:id', controller.onUpdateStock.bind(controller));

export default router;

import { BigInt } from "@graphprotocol/graph-ts";
import { tokencreated } from "../generated/DaoFactory/DaoFactory";
import { InstaDao } from "../generated/templates";
import {
  TokenEntity,
  TokenTransferEntity,
  ManualTransferEntity,
} from "../generated/schema";
import {
  Transfer,
  ManualTransfer,
} from "../generated/templates/InstaDao/InstaDao";
export function handletokencreated(eventOne: tokencreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entityOne = TokenEntity.load(eventOne.transaction.hash.toHexString());
  // let som = InstaDao.create(eventOne.params.tokenaddress);
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entityOne) {
    entityOne = new TokenEntity(eventOne.transaction.hash.toHexString());

    // entityOne fields can be set using simple assignments
    entityOne.count = BigInt.fromI32(0);
  }

  // BigInt and BigDecimal math are supported
  entityOne.count = entityOne.count + BigInt.fromI32(1);

  // entityOne fields can be set based on eventOne parameters
  entityOne.tokenaddress = eventOne.params.tokenaddress;
  entityOne.creator = eventOne.params.creator;
  entityOne.name = eventOne.params.name;
  entityOne.symbol = eventOne.params.symbol;
  entityOne.decimals = eventOne.params.deci;
  entityOne.metadata = eventOne.params.metadata;
  entityOne.totalSupply = eventOne.params.totalSupply;
  entityOne.ensName = eventOne.params.ens;
  InstaDao.create(eventOne.params.tokenaddress);
  // Entities can be written to the store with `.save()`
  entityOne.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the eventOne can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.children(...)
  // - contract.getContract(...)
}

export function handleTransfer(eventTwo: Transfer): void {
  let entityTwo = TokenTransferEntity.load(
    // eventTwo.address.toHexString() +
    //   "|" +
    eventTwo.transaction.hash.toHexString()
  );

  if (!entityTwo) {
    entityTwo = new TokenTransferEntity(
      // eventTwo.address.toHexString() +
      //   "|" +
      eventTwo.transaction.hash.toHexString()
    );
    entityTwo.count = BigInt.fromI32(0);
  }

  // BigInt and BigDecimal math are supported
  entityTwo.count = entityTwo.count + BigInt.fromI32(1);
  // entityTwo.from = eventTwo.params.from;
  entityTwo.tokenaddress = eventTwo.address.toHexString();
  entityTwo.to = eventTwo.params.to.toHexString();
  entityTwo.amt = eventTwo.params.value;
  entityTwo.save();
}

export function handleManualTransfer(event: ManualTransfer): void {
  let entity = ManualTransferEntity.load(event.transaction.hash.toHexString());

  if (!entity) {
    entity = new ManualTransferEntity(event.transaction.hash.toHexString());
    entity.count = BigInt.fromI32(0);
  }
  entity.count = entity.count + BigInt.fromI32(1);
  entity.from = event.params.from.toHexString();
  entity.to = event.params.to.toHexString();
  entity.amt = event.params.amt;
  entity.tokenaddress = event.params.tokenaddress.toHexString();
  entity.save();
}

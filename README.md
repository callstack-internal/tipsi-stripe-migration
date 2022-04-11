## Tipsi -> Stripe migration

This repository is created as an example of `tipsi-stripe` to `stripe-react-native` migration.

## Intro

If you have ever integrated payments with React Native, you may have encountered the popular community library “tipsi-stripe“. This project has been unmaintained for several years and the README now suggests migrating to the official [Stripe React Native](https://github.com/stripe/stripe-react-native) project.

To better support developers looking to migrate from “tipsi-stripe” to stripe-react-native, we’ve prepared:

- the [Stripe React Native Migration Guide](https://www.callstack.com/blog/how-to-migrate-from-tipsi-stripe-to-stripe-react-native-sdk) to walk you through the core concepts and integration steps
- a [sample](https://github.com/callstack-internal/tipsi-stripe-migration/pull/1) of such migration in form of a github PR

## Migration sample

Migration sample was created as a [PR](https://github.com/callstack-internal/tipsi-stripe-migration/pull/1) to this repository. It contains a migration (from Tipsi to Stripe React Native) of the following elements:

- Apple Pay payments
- Google Pay paymenst
- Classic Card payments

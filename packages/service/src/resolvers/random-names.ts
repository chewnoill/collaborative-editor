import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import Moniker from 'moniker';

const names = Moniker.generator([Moniker.adjective, Moniker.noun], {glue: ' '});


const RandomQueries = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Query {
        random: RandomQuery!
      }

      type RandomQuery {
	name: String!
      }
    `,
    resolvers: {
      Query: {
        random() {
          return {};
        },
      },
      RandomQuery: {
	name: () => names.choose()
      }
    },
  };
});

export default RandomQueries;

import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache, ApolloLink} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {environment} from '../environments/environment';
import { setContext } from '@apollo/client/link/context';

const uri = environment.GRAPHQL_API;

function getCookie(ccookieName: string) {
    if (document?.cookie?.length > 0) {
      let cookieStart = document.cookie.indexOf(ccookieName + '=');
      if (cookieStart !== -1) {
        cookieStart = cookieStart + ccookieName.length + 1;
        let cookieEnd = document.cookie.indexOf(';', cookieStart);
        if (cookieEnd === -1) {
          cookieEnd = document.cookie.length;
        }
        return unescape(document.cookie.substring(cookieStart, cookieEnd));
      }
    }
  return null;
}

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    const token = getCookie('authToken');

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
  });

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri, withCredentials: true })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  exports: [ApolloModule],
  imports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

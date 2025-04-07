import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    // console.log(gqlHost.getContext().req);
    const gqlError = new GraphQLError('gql 错误处理', {

    });

    console.log("发生错误");

    return gqlError;
  }
}

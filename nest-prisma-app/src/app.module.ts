import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { fa } from '@faker-js/faker';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'node:path';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      // autoSchemaFile: true,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      apollo: {
        // service:nest-app-graph:E8AWb_ZnYzSzSHMSjksLTg
        // service:nest-app-graph:WWOs6edJlRZRr5FBIrYqXA
        key: 'service:nest-app-graph-8j0guq:nKSE-KG7rjyWtQ1_mX-rbw',
        graphRef: 'nest-app-graph-8j0guq@current',
      },
      includeStacktraceInErrorResponses: true, // 是否详细的堆栈错误
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        ApolloServerPluginInlineTrace(),
        ApolloServerPluginUsageReporting({
          // endpointUrl: 'http://localhost:3000/graphql',
          sendHeaders: { all: true },
          sendErrors: { unmodified: true },
        }),
      ],
    }),
    TeacherModule,
    StudentModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FieldNode, GraphQLResolveInfo, SelectionNode } from 'graphql';

// interface
interface RequestedFieldsInfo {
  [fieldName: string]: boolean | RequestedFieldsInfo;
}

// requested fields decorator
export const RequestedFieldsDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const info: GraphQLResolveInfo = ctx.getInfo();
    const selections: readonly SelectionNode[] =
      info.fieldNodes[0].selectionSet.selections;

    const getRequestedFields = (
      selections: readonly SelectionNode[],
    ): RequestedFieldsInfo => {
      const requestedFields: RequestedFieldsInfo = {};

      selections.forEach((field: FieldNode) => {
        if (field.name.value === '__typename') return;

        if (field.selectionSet) {
          requestedFields[field.name.value] = {
            select: getRequestedFields(field.selectionSet.selections),
          };
        } else {
          requestedFields[field.name.value] = true;
        }
      });

      return requestedFields;
    };

    return getRequestedFields(selections);
  },
);

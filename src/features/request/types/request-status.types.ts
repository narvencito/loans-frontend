import { RequestStatusCode } from '../enums/request-status.enum';

export type RequestStatusTransition = {
  from: RequestStatusCode;
  to: RequestStatusCode[];
  requiresComment: boolean;
};

export type RequestStatusTransitions = Record<RequestStatusCode, RequestStatusTransition>;

export const ALLOWED_STATUS_TRANSITIONS: RequestStatusTransitions = {
  [RequestStatusCode.PENDING]: {
    from: RequestStatusCode.PENDING,
    to: [RequestStatusCode.IN_REVIEW, RequestStatusCode.CANCELLED],
    requiresComment: false
  },
  [RequestStatusCode.IN_REVIEW]: {
    from: RequestStatusCode.IN_REVIEW,
    to: [RequestStatusCode.APPROVED, RequestStatusCode.REJECTED],
    requiresComment: true
  },
  [RequestStatusCode.APPROVED]: {
    from: RequestStatusCode.APPROVED,
    to: [RequestStatusCode.CONVERTED],
    requiresComment: false
  },
  [RequestStatusCode.REJECTED]: {
    from: RequestStatusCode.REJECTED,
    to: [],
    requiresComment: true
  },
  [RequestStatusCode.CANCELLED]: {
    from: RequestStatusCode.CANCELLED,
    to: [],
    requiresComment: true
  },
  [RequestStatusCode.CONVERTED]: {
    from: RequestStatusCode.CONVERTED,
    to: [],
    requiresComment: false
  }
}; 
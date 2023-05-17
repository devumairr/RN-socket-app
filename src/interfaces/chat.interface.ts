export interface IMessage {
  room_participant_id: string;
  user_cognito_id: string;
  date_time: number;
  message: string | string[];
  type: string;
}

import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WaystarApi implements ICredentialType {
	name = 'waystarApi';
	displayName = 'Waystar API';
	documentationUrl = 'https://docs.waystar.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'OAuth 2.0 Client ID from your Waystar application',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'OAuth 2.0 Client Secret from your Waystar application',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.waystar.com/v1',
			required: true,
			description: 'The base URL for the Waystar API',
		},
	];
}
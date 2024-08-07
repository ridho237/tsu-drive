import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fileTypes = v.union(
	v.literal('jpeg'),
	v.literal('png'),
	v.literal('csv'),
	v.literal('pdf'),
	v.literal('word'),
	v.literal('powerpoint'),
	v.literal('excel'),
	v.literal('video'),
	v.literal('audio'),
	v.literal('rar'),
	v.literal('zip')
);

export const roles = v.union(v.literal('admin'), v.literal('member'));

export default defineSchema({
	files: defineTable({
		name: v.string(),
		type: fileTypes,
		orgId: v.string(),
		fileId: v.id('_storage'),
		userId: v.id('users'),
		shouldDelete: v.optional(v.boolean()),
		shareableLink: v.optional(v.string()),
		size: v.number(),
	})
		.index('by_orgId', ['orgId'])
		.index('by_shouldDelete', ['shouldDelete'])
		.index('by_shareableLink', ['shareableLink'])
		.index('by_userId_orgId', ['userId', 'orgId']),
	favorites: defineTable({
		fileId: v.id('files'),
		orgId: v.string(),
		userId: v.id('users'),
	}).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
	documents: defineTable({
		fileId: v.id('files'),
		orgId: v.string(),
		userId: v.id('users'),
	}).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
	pictures: defineTable({
		fileId: v.id('files'),
		orgId: v.string(),
		userId: v.id('users'),
	}).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
	musics: defineTable({
		fileId: v.id('files'),
		orgId: v.string(),
		userId: v.id('users'),
	}).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
	videos: defineTable({
		fileId: v.id('files'),
		orgId: v.string(),
		userId: v.id('users'),
	}).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.optional(v.string()),
		image: v.optional(v.string()),
		storageUsed: v.number(),
		orgIds: v.array(
			v.object({
				orgId: v.string(),
				role: roles,
				storageUsed: v.number(),
			})
		),
	}).index('by_tokenIdentifier', ['tokenIdentifier']),
});

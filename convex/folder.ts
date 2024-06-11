import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { hasAccessToFile, hasAccessToOrg } from './files';

export const folderDocuments = mutation({
	args: { fileId: v.id('files') },
	async handler(ctx, args) {
		const access = await hasAccessToFile(ctx, args.fileId);
		if (!access) {
			throw new ConvexError('Tidak ada akses ke File');
		}

		const document = await ctx.db
			.query('documents')
			.withIndex('by_userId_orgId_fileId', (q) =>
				q.eq('userId', access.user._id).eq('orgId', access.file.orgId).eq('fileId', access.file._id)
			)
			.first();
		if (!document) {
			await ctx.db.insert('documents', {
				fileId: access.file._id,
				userId: access.user._id,
				orgId: access.file.orgId,
			});
		} else {
			await ctx.db.delete(document._id);
		}
	},
});

export const getAllDocuments = query({
	args: { orgId: v.string() },
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			return [];
		}

		const documents = await ctx.db
			.query('documents')
			.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
			.collect();
		return documents;
	},
});

export const folderPictures = mutation({
	args: { fileId: v.id('files') },
	async handler(ctx, args) {
		const access = await hasAccessToFile(ctx, args.fileId);
		if (!access) {
			throw new ConvexError('Tidak ada akses ke File');
		}

		const picture = await ctx.db
			.query('pictures')
			.withIndex('by_userId_orgId_fileId', (q) =>
				q.eq('userId', access.user._id).eq('orgId', access.file.orgId).eq('fileId', access.file._id)
			)
			.first();
		if (!picture) {
			await ctx.db.insert('pictures', {
				fileId: access.file._id,
				userId: access.user._id,
				orgId: access.file.orgId,
			});
		} else {
			await ctx.db.delete(picture._id);
		}
	},
});

export const getAllPictures = query({
	args: { orgId: v.string() },
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			return [];
		}

		const picture = await ctx.db
			.query('pictures')
			.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
			.collect();
		return picture;
	},
});

export const folderMusics = mutation({
	args: { fileId: v.id('files') },
	async handler(ctx, args) {
		const access = await hasAccessToFile(ctx, args.fileId);
		if (!access) {
			throw new ConvexError('Tidak ada akses ke File');
		}

		const picture = await ctx.db
			.query('musics')
			.withIndex('by_userId_orgId_fileId', (q) =>
				q.eq('userId', access.user._id).eq('orgId', access.file.orgId).eq('fileId', access.file._id)
			)
			.first();
		if (!picture) {
			await ctx.db.insert('pictures', {
				fileId: access.file._id,
				userId: access.user._id,
				orgId: access.file.orgId,
			});
		} else {
			await ctx.db.delete(picture._id);
		}
	},
});

export const getAllMusics = query({
	args: { orgId: v.string() },
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			return [];
		}

		const picture = await ctx.db
			.query('musics')
			.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
			.collect();
		return picture;
	},
});

export const folderVideos = mutation({
	args: { fileId: v.id('files') },
	async handler(ctx, args) {
		const access = await hasAccessToFile(ctx, args.fileId);
		if (!access) {
			throw new ConvexError('Tidak ada akses ke File');
		}

		const picture = await ctx.db
			.query('videos')
			.withIndex('by_userId_orgId_fileId', (q) =>
				q.eq('userId', access.user._id).eq('orgId', access.file.orgId).eq('fileId', access.file._id)
			)
			.first();
		if (!picture) {
			await ctx.db.insert('pictures', {
				fileId: access.file._id,
				userId: access.user._id,
				orgId: access.file.orgId,
			});
		} else {
			await ctx.db.delete(picture._id);
		}
	},
});

export const getAllVideos = query({
	args: { orgId: v.string() },
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			return [];
		}

		const picture = await ctx.db
			.query('videos')
			.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
			.collect();
		return picture;
	},
});

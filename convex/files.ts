import { ConvexError, v } from 'convex/values';
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from './_generated/server';
import { fileTypes } from './schema';
import { Doc, Id } from './_generated/dataModel';

export const generateUploadUrl = mutation(async (ctx) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new ConvexError('Kamu harus Login untuk Upload File');
	}

	return await ctx.storage.generateUploadUrl();
});
export const createFile = mutation({
	args: {
		name: v.string(),
		fileId: v.id('_storage'),
		orgId: v.string(),
		type: fileTypes,
		size: v.number(),
	},
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			throw new ConvexError('Kamu tidak punya akses diorganisasi ini');
		}

		await ctx.db.insert('files', {
			name: args.name,
			orgId: args.orgId,
			fileId: args.fileId,
			type: args.type,
			userId: hasAccess.user._id,
			size: args.size,
		});
	},
});

export async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, orgId: string) {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		return null;
	}

	const user = await ctx.db
		.query('users')
		.withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
		.first();
	if (!user) {
		return null;
	}

	const hasAccess = user.orgIds.some((item) => item.orgId === orgId) || user.tokenIdentifier.includes(orgId);
	if (!hasAccess) {
		return null;
	}

	return { user };
}

export const getFiles = query({
	args: {
		orgId: v.string(),
		query: v.optional(v.string()),
		favorites: v.optional(v.boolean()),
		documents: v.optional(v.boolean()),
		pictures: v.optional(v.boolean()),
		musics: v.optional(v.boolean()),
		videos: v.optional(v.boolean()),
		deletedOnly: v.optional(v.boolean()),
		type: v.optional(fileTypes),
	},
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			return [];
		}

		let files = await ctx.db
			.query('files')
			.withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
			.collect();

		const query = args.query;
		if (query) {
			files = files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()));
		}
		if (args.favorites) {
			const favorites = await ctx.db
				.query('favorites')
				.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
				.collect();
			files = files.filter((file) => favorites.some((favorite) => favorite.fileId === file._id));
		}
		if (args.documents) {
			const documents = await ctx.db
				.query('documents')
				.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
				.collect();
			files = files.filter((file) => documents.some((documents) => documents.fileId === file._id));
		}
		if (args.pictures) {
			const documents = await ctx.db
				.query('pictures')
				.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
				.collect();
			files = files.filter((file) => documents.some((documents) => documents.fileId === file._id));
		}
		if (args.musics) {
			const documents = await ctx.db
				.query('musics')
				.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
				.collect();
			files = files.filter((file) => documents.some((documents) => documents.fileId === file._id));
		}
		if (args.videos) {
			const documents = await ctx.db
				.query('videos')
				.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
				.collect();
			files = files.filter((file) => documents.some((documents) => documents.fileId === file._id));
		}
		if (args.deletedOnly) {
			files = files.filter((file) => file.shouldDelete);
		} else {
			files = files.filter((file) => !file.shouldDelete);
		}
		if (args.type) {
			files = files.filter((file) => file.type === args.type);
		}

		const filesWithUrl = await Promise.all(
			files.map(async (file) => ({
				...file,
				url: await ctx.storage.getUrl(file.fileId),
			}))
		);

		return filesWithUrl;
	},
});

export const getStorageUsed = query({
	args: {
		orgId: v.string(),
	},
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			return [];
		}

		let files = await ctx.db
			.query('files')
			.withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
			.collect();

		const totalStorageBytes = files.reduce((acc, file) => acc + file.size, 0);
		const totalStorageMB = totalStorageBytes / (1024 * 1024);
		return totalStorageMB;
	},
});

export const updateStorageUsedAfterDelete = mutation({
	args: {
		userId: v.id('users'),
		size: v.number(),
	},
	async handler(ctx, args) {
		const user = await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('_id'), args.userId))
			.first();
		if (!user) {
			throw new ConvexError('User tidak ditemukan');
		}

		const updatedStorageUsed = user.storageUsed - args.size;

		await ctx.db.patch(user._id, { storageUsed: updatedStorageUsed });
	},
});

export const renameFile = mutation({
	args: {
		fileId: v.id('files'),
		newName: v.string(),
	},
	async handler(ctx, args) {
		await ctx.db.patch(args.fileId, {
			name: args.newName,
		});
	},
});

export const deleteFile = mutation({
	args: { fileId: v.id('files'), size: v.number() },
	async handler(ctx, args) {
		const access = await hasAccessToFile(ctx, args.fileId);
		if (!access) {
			throw new ConvexError('Tidak ada akses ke File');
		}

		assertCanDeleteFile(access.user, access.file);

		await ctx.db.patch(args.fileId, {
			shouldDelete: true,
		});

		await updateStorageUsedAfterDelete(ctx, {
			userId: access.user._id,
			size: args.size,
		});
	},
});

export const deleteAllFiles = internalMutation({
	args: {},
	async handler(ctx) {
		const files = await ctx.db
			.query('files')
			.withIndex('by_shouldDelete', (q) => q.eq('shouldDelete', true))
			.collect();

		await Promise.all(
			files.map(async (file) => {
				await ctx.storage.delete(file.fileId);
				return await ctx.db.delete(file._id);
			})
		);
	},
});

function assertCanDeleteFile(user: Doc<'users'>, file: Doc<'files'>) {
	const canDelete = file.userId === user._id || user.orgIds.find((org) => org.orgId === file.orgId)?.role === 'admin';

	if (!canDelete) {
		throw new ConvexError('Kamu tidak punya akses untuk Menghapus file ini');
	}
}

export const restoreFile = mutation({
	args: { fileId: v.id('files') },
	async handler(ctx, args) {
		const access = await hasAccessToFile(ctx, args.fileId);
		if (!access) {
			throw new ConvexError('Tidak ada akses ke File');
		}

		assertCanDeleteFile(access.user, access.file);

		await ctx.db.patch(args.fileId, {
			shouldDelete: false,
		});
	},
});

export const toggleFavorite = mutation({
	args: { fileId: v.id('files') },
	async handler(ctx, args) {
		const access = await hasAccessToFile(ctx, args.fileId);
		if (!access) {
			throw new ConvexError('Tidak ada akses ke File');
		}

		const favorite = await ctx.db
			.query('favorites')
			.withIndex('by_userId_orgId_fileId', (q) =>
				q.eq('userId', access.user._id).eq('orgId', access.file.orgId).eq('fileId', access.file._id)
			)
			.first();
		if (!favorite) {
			await ctx.db.insert('favorites', {
				fileId: access.file._id,
				userId: access.user._id,
				orgId: access.file.orgId,
			});
		} else {
			await ctx.db.delete(favorite._id);
		}
	},
});

export const getAllFavorites = query({
	args: { orgId: v.string() },
	async handler(ctx, args) {
		const hasAccess = await hasAccessToOrg(ctx, args.orgId);
		if (!hasAccess) {
			return [];
		}

		const favorites = await ctx.db
			.query('favorites')
			.withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
			.collect();

		return favorites;
	},
});

export async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<'files'>) {
	const file = await ctx.db.get(fileId);
	if (!file) {
		return null;
	}

	const hasAccess = await hasAccessToOrg(ctx, file.orgId);
	if (!hasAccess) {
		return null;
	}

	return { user: hasAccess.user, file };
}

export const generateShareableLink = mutation({
	args: {
		fileId: v.id('files'),
	},
	async handler(ctx, args) {
		const file = await ctx.db.get(args.fileId);
		if (!file) {
			throw new ConvexError('File tidak ada');
		}

		const shareableLink = await ctx.storage.getUrl(file.fileId);
		if (shareableLink === null) {
			throw new ConvexError('Gagal saat mengenerate shareable link');
		}
		try {
			await ctx.db.patch(args.fileId, {
				shareableLink,
			});
		} catch (error) {
			console.error('Error mengupdate file shareable link:', error);
			throw new ConvexError(' Gagal mengupdate file shareable link');
		}

		return shareableLink;
	},
});

export const getFileByShareableLink = query({
	args: {
		shareableLink: v.string(),
	},
	async handler(ctx, args) {
		const file = await ctx.db
			.query('files')
			.withIndex('by_shareableLink', (q) => q.eq('shareableLink', args.shareableLink))
			.first();
		if (!file) {
			throw new ConvexError('File tidak ada');
		}

		return file;
	},
});

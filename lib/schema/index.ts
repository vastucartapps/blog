// Barrel — public surface of the lib/schema module.
// Pages and components import from here, not from individual files.

export * from "./constants";
export { buildOrganizationReference, buildOrganizationStub } from "./organization";
export { buildWebsiteSchema } from "./website";
export { buildBlogEntitySchema } from "./blog";
export {
  buildPersonSchema,
  buildAllPersonSchemas,
  type Author,
} from "./person";
export { buildProfilePageSchema } from "./profilePage";
export {
  buildBlogPostingSchemas,
  type BlogPostingBuildResult,
} from "./blogPosting";
export {
  buildBreadcrumbListSchema,
  type BreadcrumbNode,
} from "./breadcrumbList";
export { buildFAQPageSchema, type FAQInput } from "./faqPage";
export {
  buildCollectionPageSchema,
  type CollectionItem,
  type CollectionPageInput,
} from "./collectionPage";
export { buildAboutPageSchema, type AboutPageInput } from "./aboutPage";
export { buildDefinedTermSchemas, type DefinedTermEntry } from "./definedTerm";
export { buildHowToSchemas } from "./howTo";
export { buildProductSchemas } from "./product";
export { buildRecipeSchema } from "./recipe";
export { buildEventSchema } from "./event";
export {
  buildGemstoneCourseSchema,
  buildLearningPathCourseSchema,
  type LearningPathInput,
  type LearningPathLesson,
} from "./course";
export {
  buildConsultationServiceSchemas,
  CONSULTATION_SERVICE_REF,
} from "./service";
export {
  buildImageObjectSchemas,
  type ImageManifestEntry,
} from "./imageObject";
export { buildSpeakableSchema } from "./speakableSpec";
export { buildPostSchema } from "./post";
export {
  buildPillarSchemas,
  type PillarPart,
  type PillarSchemaInput,
} from "./pillar";

export class Constants {
  public static get MAX_PRODUCTS_PER_PAGE(): number {
    return 8;
  }

  public static get API_URL(): string {
    return `http://localhost:3000`;
  }

  public static get API_PRODUCT(): string {
    return `${this.API_URL}/products`;
  }
}

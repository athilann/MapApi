FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy project files first for layer caching
COPY src/MapApi.Domain/MapApi.Domain.csproj src/MapApi.Domain/
COPY src/MapApi.Application/MapApi.Application.csproj src/MapApi.Application/
COPY src/MapApi.Infrastructure/MapApi.Infrastructure.csproj src/MapApi.Infrastructure/
COPY src/MapApi.Api/MapApi.Api.csproj src/MapApi.Api/
RUN dotnet restore src/MapApi.Api/MapApi.Api.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish src/MapApi.Api/MapApi.Api.csproj -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "MapApi.Api.dll"]

# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy all csproj files and restore as distinct layers
COPY ["src/Kinetic3D.WebAPI/Kinetic3D.WebAPI.csproj", "src/Kinetic3D.WebAPI/"]
COPY ["src/Kinetic3D.Application/Kinetic3D.Application.csproj", "src/Kinetic3D.Application/"]
COPY ["src/Kinetic3D.Domain/Kinetic3D.Domain.csproj", "src/Kinetic3D.Domain/"]
COPY ["src/Kinetic3D.Infrastructure/Kinetic3D.Infrastructure.csproj", "src/Kinetic3D.Infrastructure/"]

RUN dotnet restore "./src/Kinetic3D.WebAPI/Kinetic3D.WebAPI.csproj"

# Copy the remaining source code
COPY src/ src/

WORKDIR "/src/src/Kinetic3D.WebAPI"
RUN dotnet build "./Kinetic3D.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Kinetic3D.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Kinetic3D.WebAPI.dll"]

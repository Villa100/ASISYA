# ETAPA 1: BUILD
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copiar archivos .csproj y solucionar la restauración de dependencias
COPY *.sln .
COPY ASISYA_ev.Domain/*.csproj ASISYA_ev.Domain/
COPY ASISYA_ev.Application/*.csproj ASISYA_ev.Application/
COPY ASISYA_ev.Infrastructure/*.csproj ASISYA_ev.Infrastructure/
COPY ASISYA_ev.Api/*.csproj ASISYA_ev.Api/

RUN dotnet restore

# Copiar el resto del código y compilar
COPY . .
WORKDIR /src/ASISYA_ev.Api
RUN dotnet publish -c Release -o /app/publish

# ETAPA 2: RUNTIME
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "ASISYA_ev.dll"]